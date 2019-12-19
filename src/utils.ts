import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

const freePackages: Partial<{ [prefix in IconPrefix]: string }> = {
    fas: "free-solid-svg-icons",
    far: "free-regular-svg-icons",
    fab: "free-brands-svg-icons",
};

const proPackages: { [prefix in IconPrefix]: string } = {
    fas: "pro-solid-svg-icons",
    far: "pro-regular-svg-icons",
    fal: "pro-light-svg-icons",
    fab: "pro-brands-svg-icons",
    fad: "pro-duotone-svg-icons",
};

export function getModuleId(value: IconName | [IconPrefix, IconName], pro: boolean) {
    let prefix: IconPrefix;
    let iconName: IconName;
    if (typeof (value) === "string") {
        prefix = "fas";
        iconName = value;
    } else {
        prefix = value[0] || "fas";
        iconName = value[1];
    }

    const packageName = pro ? proPackages[prefix] : freePackages[prefix];

    if (!packageName) {
        throw new Error(`Unable to determine fontawesome package for prefix '${prefix}'`);
    }

    return `@fortawesome/${packageName}/fa${toPascalCase(iconName)}`;
}

export function toPascalCase(input: string): string {
    // https://stackoverflow.com/a/4068586/963753
    return input.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()).replace(/[ -]/g, "");
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return !!value;
}
