export class Properties {
    private readonly _slackBotToken: string;
    private readonly _channelId: string;
    private readonly _slackDomain: string;
    private readonly _conversationsMembersUrl: string;
    private readonly _usersInfoUrl: string;
    private readonly _sheetName: string;

    constructor() {
        // @ts-ignore
        this._slackBotToken =
            PropertiesService.getScriptProperties().getProperty("slackBotToken");
        // @ts-ignore
        this._channelId =
            PropertiesService.getScriptProperties().getProperty("channelId");
        // @ts-ignore
        this._sheetName =
            PropertiesService.getScriptProperties().getProperty("sheetName");
        this._slackDomain = "https://slack.com/api/";
        this._conversationsMembersUrl = "conversations.members";
        this._usersInfoUrl = "users.info";
    }

    get slackBotToken(): string {
        return this._slackBotToken;
    }

    get channelId(): string {
        return this._channelId;
    }

    get slackDomain(): string {
        return this._slackDomain;
    }

    get conversationsMembersUrl(): string {
        return this._conversationsMembersUrl;
    }

    get usersInfoUrl(): string {
        return this._usersInfoUrl;
    }

    get sheetName(): string {
        return this._sheetName;
    }
}
