import repoItemRender from "./repoItem.ts";

export default function repoListRender(items:any[]):string {
    var itemsHtml = '';
    for( var item of items) {
        itemsHtml+= repoItemRender(item);
    }
    return `
        <div class="repos-list">
            ${ itemsHtml }
        </div>
    `;
}
