import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";
export declare function getModuleId(value: IconName | [IconPrefix, IconName], pro: boolean): string;
export declare function toPascalCase(input: string): string;
export declare function notEmpty<TValue>(value: TValue | null | undefined): value is TValue;
