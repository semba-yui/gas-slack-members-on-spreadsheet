import { doUpdate } from "./main";

declare const global: {
    [x: string]: unknown;
};

global.doUpdate = doUpdate;
