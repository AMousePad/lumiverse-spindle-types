import type { SpindlePermission } from "./permissions.js";
import type { SpindleFrontendRuntimeCapability } from "./frontend-capabilities.js";
/** Extension info as returned by the backend API */
export interface ExtensionInfo {
    id: string;
    identifier: string;
    name: string;
    version: string;
    author: string;
    description: string;
    github: string;
    homepage: string;
    permissions: SpindlePermission[];
    granted_permissions: SpindlePermission[];
    enabled: boolean;
    installed_at: number;
    updated_at: number;
    has_frontend: boolean;
    has_backend: boolean;
    /** Capabilities declared by the currently running backend worker. */
    frontend_runtime_capabilities?: SpindleFrontendRuntimeCapability[];
    status: "running" | "stopped" | "error";
    metadata: Record<string, unknown>;
}
