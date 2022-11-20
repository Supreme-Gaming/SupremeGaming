import { TextChannel, MessageEmbed, Collection, Message, MessageEmbedOptions } from 'discord.js';

export class Dialog {
  private _ts: DialogTranscriptEvent[];
  private _ch: TextChannel;
  private _index = 0;

  constructor(channel: TextChannel, transcript: DialogTranscriptEvent[]) {
    this._ch = channel;
    this._ts = transcript;

    this.run();
  }

  private async run() {
    // Check if the registered class index points to a valid transcript event.
    // If it does, attempt to execute it's contents.
    // If it doesn't, leave alone for the garbage collector to do it's thing.
    if (this._ts[this._index]) {
      const event = this._ts[this._index];

      await this.message(event);

      await this.collect(event);
    }
  }

  private async message(event: DialogTranscriptEvent, lookup?: any) {
    const prompt: DialogPromptOptions = typeof event.prompt === 'object' ? event.prompt : event.prompt(lookup);

    if (prompt.type === 'rich-embed') {
      // Handle rich embed prompt auto-casting.

      // TODO: Figure out this ts union thing to avoid asserting prompt as any
      // Want TS to recognize what type of prompt based on the accepted conditional.
      const opts = (prompt as any).options;

      const embed = new MessageEmbed({ ...opts });

      this._ch.send({ embeds: [embed] });

      return;
    } else if (prompt.type === 'plain-text') {
      const text = (prompt as any).content;

      this._ch.send(text);

      return;
    }
  }

  /**
   * Start collecting client messages if there is a collect key and there are
   * actions that match the evaluated result of the collector
   */
  private async collect(event: DialogTranscriptEvent) {
    if (event.collect && event.collect.actions.length > 0) {
      let capture: Collection<string, Message>;

      try {
        const botFilter = (captured: Message) => captured.content && !captured.author.bot;
        capture = await this._ch.awaitMessages({
          filter: botFilter,
          max: 1,
          time: event.wait ? event.wait * 1000 : 5 * 1000,
          errors: ['time'],
        });
      } catch (err) {
        this._ch.send('Response collection timed out. Please try again.');
        return;
      }

      return await this.executeCollectorAction(event, capture);
    }
  }

  /**
   * Based on the value of the collector, scan the actions to see if a matching action
   * exists.
   *
   * Only the first action passing the test will be executed.
   */
  private async executeCollectorAction(event: DialogTranscriptEvent, capture: Collection<string, Message>) {
    if (event && event.collect) {
      let transformedValue = '';
      let message: any;

      const matchingAction = event.collect.actions.find((action) => {
        // Handle the wildcard any value.
        if (action.accept.includes('*')) {
          return action;
        }

        const captureMessageContainingAccept = capture.find((message) => {
          // // If there is a provided value transformation, call it before checking for equality.
          if (event.collect && event.collect.value && event.collect.value.transformation) {
            // Cast resolved value to a string to ensure fair equality checks.
            transformedValue = event.collect.value.transformation(message).toString().trim();
          } else {
            transformedValue = message.cleanContent.trim();
          }

          return action.accept.indexOf(transformedValue) > -1;
        });

        if (captureMessageContainingAccept) {
          message = captureMessageContainingAccept;
          return action;
        }
      });

      // Here is where we'll see the matching action, if any.
      if (matchingAction) {
        let response;

        // If there is an action to perform, run it before proceeding to finalize with `next`.
        if (matchingAction.action) {
          response = await matchingAction.action(message, transformedValue);
        }

        if (matchingAction.next) {
          return await this.message(matchingAction.next, response);
        } else {
          return;
        }
      } else {
        this._ch.send('I was unable to understand your response. Please try again.');
      }
    } else {
      return;
    }
  }
}

export interface DialogTranscriptEvent {
  /**
   * The type of dialog to send.
   *
   * Rich embed or plain-text.
   */
  prompt: DialogPromptOptions | DialogPromptOptionsFactory;

  // factory?: (a: DialogPromptOptions) => DialogPromptOptions;

  /**
   * If provided, definitions that determine the rules on which dialog
   * will proceed.
   *
   * For example, this can be used to capture a `yes` or a `no` response from a client.
   */
  collect?: DialogCollector;

  /**
   * Time to wait (in seconds) at the end of the current event, before executing the next action.
   *
   * This time is inherited by all sub-actions.
   *
   * Defaults to `5` if `collect` is defined.
   */
  wait?: number;
}

interface TranscriptPromptBase {
  type: 'plain-text' | 'rich-embed';
}

interface DialogTranscriptPromptPlainText extends TranscriptPromptBase {
  /**
   * Used only with plain text prompt responses.
   */
  content: string;
}

interface DialogTranscriptPromptEmbed extends TranscriptPromptBase {
  /**
   * Used only with rich embed prompt responses.
   */
  options: MessageEmbedOptions;
}

type DialogPromptOptions = DialogTranscriptPromptPlainText | DialogTranscriptPromptEmbed;

type DialogPromptOptionsFactory = (lookup: any) => DialogPromptOptions;

export interface DialogCollector {
  /**
   * Definition that describes how the value from a collection event will be resolved.
   */
  value?: DialogResponseResolver;

  /**
   * List of potential actions to take based on the value of the dialog collector.
   */
  actions: Array<DialogResponseAction>;

  /**
   * Marks actions as a series of step-able events that should be exhaustively processed.
   *
   * When `true` and accept `value` is `["*"]`, root-level actions will be performed in sequence after the last completes.
   * This is useful when dialogs consist of multiple back-and-forth client-bot interactions or steps. Each action
   * is considered complete whenever the action has no further child dialog transcript events with response collectors
   *
   * When `false`, only one action is executed and the dialog is terminated.
   *
   * Defaults to `false`
   */
  stepable?: boolean;

  /**
   * **TODO: Not yet implemented!**
   *
   * Definition that describes the number of times a response collection must be retried
   * if none of the `actions` match `DialogCollector`'s resolved value.
   *
   */
  retry?: DialogCollectorRetry;
}

interface DialogResponseResolver {
  /**
   * Dot notation supported property path used to retrieve a response value.
   *
   *
   * For example: `channel.id`
   */
  target: keyof Message;

  /**
   * If provided, callback function executed against the resolved target value.
   */
  transformation?: (lookup: Message) => any;
}

interface DialogResponseAction {
  /**
   * Acceptable resolved dialog response values in order to execute this action.
   *
   * Include `*` to accept any value.
   *
   * If the resolved dialog response does not match any of the response action `accept` values,
   * the parent `DialogCollector` will trigger a response retry.
   *
   * Values are **case-sensitive**. Use the provide a `transformation` callback function in order
   * to perform any transformations to the value before comparisons are performed.
   */
  accept: Array<string | boolean | number | '*'>;

  /**
   * Callback function executed whenever the resolved dialog value matches the response action value.
   *
   * This is where the logic for the response would be handled.
   *
   * The callback is injected with the `message` and the resolved dialog `value`.
  
   */
  action?: (message: Message, value: string) => void;

  /**
   * Describes the next dialog to send to client after the action, if any, is performed.
   *
   * If omitted, the current dialog branch will terminate and proceed to the next
   * root-level sibling if any. If none found there, the dialog will terminate altogether.
   */
  next?: DialogTranscriptEvent;
}

interface DialogCollectorRetry {
  /**
   * Message to send to the client prompting a response retry.
   */
  message?: DialogTranscriptEvent;

  /**
   * Number of times to retry response collection before terminating the Dialog altogether.
   */
  count: number;
}
