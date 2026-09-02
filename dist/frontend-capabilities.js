/**
 * Backend-declared capabilities that require the host to coordinate frontend
 * extension startup before rendering dependent UI.
 */
export const ALL_FRONTEND_RUNTIME_CAPABILITIES = [
    "message_tag_interceptor",
];
export function isValidFrontendRuntimeCapability(capability) {
    return ALL_FRONTEND_RUNTIME_CAPABILITIES.includes(capability);
}
