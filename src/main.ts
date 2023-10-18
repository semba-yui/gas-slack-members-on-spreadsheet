import { Properties } from "./model/properties";

const properties = new Properties();
// @ts-ignore
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    properties.sheetName
);

// @ts-ignore
export function doUpdate(): GoogleAppsScript.Content.TextOutput {
    updateMembers();
    updateUserInfo();
}

/**
 * スプレッドシートのメンバー名一覧を更新する.
 */
function updateMembers(): void {
    const sheetMembers: Array<string> = fetchMembersAtSheet();
    const channelMembers: Array<string> = fetchMembersAtChannel();
    const diffMembers: Array<string> = channelMembers.filter(
        (member: string) => sheetMembers.indexOf(member) == -1
    );
    console.log("スプレッドシートに名前が無い人一覧");
    console.log(diffMembers);
    console.log(`${diffMembers.length} 人`);

    if (diffMembers.length) {
        // @ts-ignore
        const lastRow: Integer = sheet.getLastRow();
        const range = sheet.getRange(lastRow + 1, 1, diffMembers.length, 1);
        range.setValues(transpose([diffMembers]));
    }
}

/**
 * Slack名、メールアドレスを更新する。
 */
function updateUserInfo(): void {
    const members: Array<string> = fetchMembersAtSheet();
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
function fetchMembersAtSheet(): Array<string> {
    const lastRow: number = sheet.getLastRow();
    const num: number = lastRow - 1;
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
function fetchMembersAtChannel(): Array<string> {
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

    console.info(
        `チャンネルID: ${channelId} の conversations.members を取得しました。`
    );
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
function fetchUserInfo(userId: string): UserInfo | null {
    const url = `${properties.slackDomain}${properties.usersInfoUrl}?user=${userId}`;
    // @ts-ignore
    const httpResponse: HTTPResponse = UrlFetchApp.fetch(
        url,
        createRequestOptions()
    );
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

    const name: string = body.user.profile.real_name;
    const email: string = body.user.profile.email;

    console.log(`名前: ${name}`);
    console.log(`email: ${email}`);

    return {
        name: name,
        email: email,
    };
}

/**
 * Slack API へのリクエストパラメータのオプション項目を生成.
 */
// @ts-ignore
function createRequestOptions(): URLFetchRequestOptions {
    return {
        contentType: "application/json; charset=utf-8;",
        headers: {
            Authorization: `Bearer ${properties.slackBotToken}`,
        },
        method: "get",
    };
}

/**
 * 2次元配列の転置.
 *
 * @param arr
 */
function transpose(arr: Array<Array<string>>): Array<Array<string>> {
    return arr[0].map((_, c) => arr.map((r) => r[c]));
}

interface UserInfo {
    name: string;
    email: string;
}
