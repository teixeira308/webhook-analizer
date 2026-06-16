export class IntegrationNotFoundError extends Error {
  constructor(integration: string) {
    super(`Integração '${integration}' não encontrada`);
    this.name = "IntegrationNotFoundError";
  }
}

export class WebhookValidationError extends Error {
  public errors: string[];

  constructor(errors: string[]) {
    super("Webhook falhou na validação");
    this.name = "WebhookValidationError";
    this.errors = errors;
  }
}
