function doUpdate() {
}/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "doUpdate": () => (/* binding */ doUpdate)
                    /* harmony export */
});
/* harmony import */ var _model_properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/properties */ "./src/model/properties.ts");

                const properties = new _model_properties__WEBPACK_IMPORTED_MODULE_0__.Properties();
                // @ts-ignore
                const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.sheetName);

                // @ts-ignore
                function doUpdate() {
                    updateMembers();
                    updateUserInfo();
                }

                /**
                 * スプレッドシートのメンバー名一覧を更新する.
                 */
                function updateMembers() {
                    const sheetMembers = fetchMembersAtSheet();
                    const channelMembers = fetchMembersAtChannel();
                    const diffMembers = channelMembers.filter(member => sheetMembers.indexOf(member) == -1);
                    console.log("スプレッドシートに名前が無い人一覧");
                    console.log(diffMembers);
                    console.log(`${diffMembers.length} 人`);
                    if (diffMembers.length) {
                        // @ts-ignore
                        const lastRow = sheet.getLastRow();
                        const range = sheet.getRange(lastRow + 1, 1, diffMembers.length, 1);
                        range.setValues(transpose([diffMembers]));
                    }
                }

                /**
                 * Slack名、メールアドレスを更新する。
                 */
                function updateUserInfo() {
                    const members = fetchMembersAtSheet();
                    console.info(members);
                    members.forEach((member, i) => {
                        if (!member) {
                            return;
                        }
                        const range = sheet.getRange(i + 2, 2, 1, 2);
                        const beforeUpdate = range.getValues().flat();
                        if (beforeUpdate[0] && beforeUpdate[1]) {
                            console.info("情報が揃っているため更新不要です。");
                            return;
                        }
                        const userInfo = fetchUserInfo(member);
                        if (userInfo === null) {
                            console.error("userInfo が null です。");
                            return;
                        }
                        console.log(userInfo);
                        range.setValues([Object.values(userInfo)]);
                    });
                }

                /**
                 * 現在シートに登録されている名前一覧を取得.
                 */
                function fetchMembersAtSheet() {
                    const lastRow = sheet.getLastRow();
                    const num = lastRow - 1;
                    console.log(`現在のスプレッドシートに登録されている人数: ${num}`);
                    if (!num) {
                        return [];
                    }
                    const range = sheet.getRange(2, 1, num, 1);
                    return range.getValues().flat();
                }

                /**
                 * Slack チャンネルにいる人一覧を取得.
                 */
                function fetchMembersAtChannel() {
                    const limit = 300;
                    const channelId = properties.channelId;
                    const url = `${properties.slackDomain}${properties.conversationsMembersUrl}?channel=${channelId}&limit=${limit}`;
                    // @ts-ignore
                    const httpResponse = UrlFetchApp.fetch(url, createRequestOptions());
                    if (httpResponse == null || !httpResponse) {
                        console.error("レスポンスが空です。");
                        return [];
                    }
                    const httpStatusCode = httpResponse.getResponseCode();
                    const responseBody = httpResponse.getContentText();
                    if (httpStatusCode !== 200) {
                        console.error("レスポンスが200以外です。");
                        console.error(httpStatusCode);
                        console.error(responseBody);
                        return [];
                    }
                    console.info(`チャンネルID: ${channelId} の conversations.members を取得しました。`);
                    console.info(responseBody);
                    const body = JSON.parse(responseBody);
                    if (body.ok !== true) {
                        console.error("レスポンスが異常です。");
                    }
                    console.log(`チャンネルID: ${channelId} の参加人数: ${body.members.length}`);
                    return body.members;
                }

                /**
                 * Slack名 と Slack 登録メールアドレスを取得
                 */
                function fetchUserInfo(userId) {
                    const url = `${properties.slackDomain}${properties.usersInfoUrl}?user=${userId}`;
                    // @ts-ignore
                    const httpResponse = UrlFetchApp.fetch(url, createRequestOptions());
                    if (httpResponse == null || !httpResponse) {
                        console.error("レスポンスが空です。");
                        return null;
                    }
                    const httpStatusCode = httpResponse.getResponseCode();
                    const responseBody = httpResponse.getContentText();
                    if (httpStatusCode !== 200) {
                        console.error("レスポンスが200以外です。");
                        console.error(httpStatusCode);
                        console.error(responseBody);
                        return null;
                    }
                    console.info(`ユーザーID: ${userId} の users.info を取得しました。`);
                    console.info(responseBody);
                    const body = JSON.parse(responseBody);
                    if (body.ok !== true) {
                        console.error("レスポンスが異常です。");
                    }
                    const name = body.user.profile.real_name;
                    const email = body.user.profile.email;
                    console.log(`名前: ${name}`);
                    console.log(`email: ${email}`);
                    return {
                        name: name,
                        email: email
                    };
                }

                /**
                 * Slack API へのリクエストパラメータのオプション項目を生成.
                 */
                // @ts-ignore
                function createRequestOptions() {
                    return {
                        contentType: "application/json; charset=utf-8;",
                        headers: {
                            Authorization: `Bearer ${properties.slackBotToken}`
                        },
                        method: "get"
                    };
                }

                /**
                 * 2次元配列の転置.
                 *
                 * @param arr
                 */
                function transpose(arr) {
                    return arr[0].map((_, c) => arr.map(r => r[c]));
                }

                /***/
}),

/***/ "./src/model/properties.ts":
/*!*********************************!*\
  !*** ./src/model/properties.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Properties": () => (/* binding */ Properties)
                    /* harmony export */
});
                class Properties {
                    constructor() {
                        // @ts-ignore
                        this._slackBotToken = PropertiesService.getScriptProperties().getProperty("slackBotToken");
                        // @ts-ignore
                        this._channelId = PropertiesService.getScriptProperties().getProperty("channelId");
                        // @ts-ignore
                        this._sheetName = PropertiesService.getScriptProperties().getProperty("sheetName");
                        this._slackDomain = "https://slack.com/api/";
                        this._conversationsMembersUrl = "conversations.members";
                        this._usersInfoUrl = "users.info";
                    }
                    get slackBotToken() {
                        return this._slackBotToken;
                    }
                    get channelId() {
                        return this._channelId;
                    }
                    get slackDomain() {
                        return this._slackDomain;
                    }
                    get conversationsMembersUrl() {
                        return this._conversationsMembersUrl;
                    }
                    get usersInfoUrl() {
                        return this._usersInfoUrl;
                    }
                    get sheetName() {
                        return this._sheetName;
                    }
                }

                /***/
})

        /******/
});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
            /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
            /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
        /******/
}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for (var key in definition) {
/******/ 				if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                    /******/
}
                /******/
}
            /******/
};
        /******/
})();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function () {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
                /******/
} catch (e) {
/******/ 				if (typeof window === 'object') return window;
                /******/
}
            /******/
})();
        /******/
})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
        /******/
})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/
}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
            /******/
};
        /******/
})();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() => {
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        __webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.ts");

        __webpack_require__.g.doUpdate = _main__WEBPACK_IMPORTED_MODULE_0__.doUpdate;
    })();

    /******/
})()
    ;
