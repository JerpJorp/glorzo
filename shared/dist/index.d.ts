export interface ExampleSharedType {
    message: string;
}
export interface TestApiResponse {
    status: string;
    data: {
        id: number;
        name: string;
        timestamp: string;
    };
    sharedMessage: ExampleSharedType;
}
export interface OpenRouterModelPricing {
    prompt: string;
    completion: string;
    request: string;
    image: string;
}
export interface OpenRouterModelArchitecture {
    modality: string;
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
    instruct_type: string | null;
}
export interface OpenRouterModelTopProvider {
    is_moderated: boolean;
    context_length: number;
    max_completion_tokens: number | null;
}
export interface OpenRouterModel {
    id: string;
    canonical_slug: string | null;
    name: string;
    created: number;
    pricing: OpenRouterModelPricing;
    context_length: number;
    architecture: OpenRouterModelArchitecture;
    top_provider: OpenRouterModelTopProvider;
    per_request_limits: any | null;
    supported_parameters: string[];
    default_parameters: any | null;
    description: string;
}
export interface OpenRouterModelsResponse {
    data: OpenRouterModel[];
}
