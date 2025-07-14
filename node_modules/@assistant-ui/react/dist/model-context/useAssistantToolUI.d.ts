import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
export type AssistantToolUIProps<TArgs, TResult> = {
    toolName: string;
    render: ToolCallContentPartComponent<TArgs, TResult>;
};
export declare const useAssistantToolUI: (tool: AssistantToolUIProps<any, any> | null) => void;
//# sourceMappingURL=useAssistantToolUI.d.ts.map