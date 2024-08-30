
import action from "./json/action.json";
import clothes from "./json/clothes.json";
import decor from "./json/decor.json";
import eye from "./json/eye.json";
import env from "./json/env.json";
import face from "./json/face.json";
import goods from "./json/goods.json";
import hair from "./json/hair.json";
import NSFW from "./json/NSFW.json";
import person from "./json/person.json";
import scene from "./json/scene.json";
import shape from "./json/shape.json";
import shoes from "./json/shoes.json";
import start from "./json/start.json";
import socks from "./json/socks.json";
import style from "./json/style.json";

import type { Tag, TagDB } from "../types";

const tagDB: TagDB = {
    action,
    clothes,
    decor,
    eye,
    env,
    face,
    goods,
    hair,
    NSFW,
    person,
    scene,
    shape,
    shoes,
    start,
    socks,
    style
};

let allTags: Tag[] = [];

// Iterate over each category in the tagDB
for (const category in tagDB) {
    const categoryTags = tagDB[category];

    // If there are normal tags, add them to the array
    if (categoryTags.normal) {
        for (const subCategory in categoryTags.normal) {
            allTags = allTags.concat(categoryTags.normal[subCategory]);
        }
    }

    // If there are r18 tags, add them to the array
    if (categoryTags.r18) {
        for (const subCategory in categoryTags.r18) {
            allTags = allTags.concat(categoryTags.r18[subCategory]);
        }
    }
}

export default tagDB;
export { allTags };