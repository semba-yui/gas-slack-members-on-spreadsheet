/**
 * スプレッドシートの情報を取得し、Google Form を更新する.
 */
function getMembers() {
    /**
    // スプレッドシートの情報を取得する
    //
    **/

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 参加対象者の情報を取得
    const sheet = ss.getSheetByName("参加対象者");

    // スプレッドシートのB1のセルが「名前」の場合
    if ("名前" !== sheet.getRange("B1").getValue()) {
        log.error("シートの状態が想定外です。");
        return;
    }

    // B行の2行目からコンテンツをもつ最後の行までの値を配列で取得する
    const target = sheet.getRange(2, 2, sheet.getLastRow() - 1).getValues();

    /**
    // Googleフォームのプルダウン内の値を上書きする
    //
    **/

    const form = FormApp.openById(
        PropertiesService.getScriptProperties().getProperty("formId")
    );

    // 質問項目がプルダウンのもののみ取得
    const items = form.getItems(FormApp.ItemType.LIST);

    items.forEach((item) => {
        // 質問項目が「氏名をプルダウンから選択してください。」を含むものに対して、スプレッドシートの内容を反映する
        if (item.getTitle().match(/氏名.*$/)) {
            const listItemQuestion = item.asListItem();
            const choices = target
                .flat() // 2次元配列 → 1次元配列に
                .filter(Boolean) // 存在チェック
                .map((name) => {
                    return listItemQuestion.createChoice(name);
                });

            // プルダウンの選択肢を上書きする
            listItemQuestion.setChoices(choices);
        }
    });
}
