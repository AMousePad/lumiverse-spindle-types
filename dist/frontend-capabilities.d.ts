/**
 * Backend-declared capabilities that require the host to coordinate frontend
 * extension startup before rendering dependent UI.
 */
export declare const ALL_FRONTEND_RUNTIME_CAPABILITIES: readonly ["message_tag_interceptor"];
export type SpindleFrontendRuntimeCapability = (typeof ALL_FRONTEND_RUNTIME_CAPABILITIES)[number];
export declare function isValidFrontendRuntimeCapability(capability: string): capability is SpindleFrontendRuntimeCapability;
