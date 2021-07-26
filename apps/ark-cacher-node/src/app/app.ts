export class ArkCacherApp {
  public async start() {
    // At this point the database connection has been made.

    // Next step is to register the host with the api.
    // A Host registration class will submit the request, and hold an internal
    // cache of host settings derived form the api response.

    // A separate Host game servers configuration class will request a list
    // of configured game servers for for this host and periodically refresh that list

    // Then once we have a list of game servers to process, we can submit that list
    // to an ark-data wrapper class to process the list.
    return;
  }
}
