import { atom } from "recoil";
export const openAtom = atom({
    key: "openAtom",
    default: false,
});
export const countAtom = atom({
    key: "countAtom",
    default: 0,
});
export const upgradeModalAtom = atom({
    key: "upgradeModalAtom",
    default: false,
});
export const isSubscribeAtom = atom({
    key: "isSubscribeAtom",
    default: false,
});
export const limitAtom = atom({
    key: "limitAtom",
    default: 5,
});