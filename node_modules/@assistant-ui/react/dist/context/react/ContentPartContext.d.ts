import { ReadonlyStore } from "../ReadonlyStore";
import { UseBoundStore } from "zustand";
import { ContentPartRuntime } from "../../api/ContentPartRuntime";
export type ContentPartContextValue = {
    useContentPartRuntime: UseBoundStore<ReadonlyStore<ContentPartRuntime>>;
};
export declare const ContentPartContext: import("react").Context<ContentPartContextValue | null>;
export declare function useContentPartRuntime(options?: {
    optional?: false | undefined;
}): ContentPartRuntime;
export declare function useContentPartRuntime(options?: {
    optional?: boolean | undefined;
}): ContentPartRuntime | null;
export declare const useContentPart: {
    (): import("../..").ContentPartState;
    <TSelected>(selector: (state: import("../..").ContentPartState) => TSelected): TSelected;
    <TSelected>(selector: ((state: import("../..").ContentPartState) => TSelected) | undefined): import("../..").ContentPartState | TSelected;
    (options: {
        optional?: false | undefined;
    }): import("../..").ContentPartState;
    (options: {
        optional?: boolean | undefined;
    }): import("../..").ContentPartState | null;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: (state: import("../..").ContentPartState) => TSelected;
    }): TSelected;
    <TSelected>(options: {
        optional?: false | undefined;
        selector: ((state: import("../..").ContentPartState) => TSelected) | undefined;
    }): import("../..").ContentPartState | TSelected;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: (state: import("../..").ContentPartState) => TSelected;
    }): TSelected | null;
    <TSelected>(options: {
        optional?: boolean | undefined;
        selector: ((state: import("../..").ContentPartState) => TSelected) | undefined;
    }): import("../..").ContentPartState | TSelected | null;
};
//# sourceMappingURL=ContentPartContext.d.ts.map