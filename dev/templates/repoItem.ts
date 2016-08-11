export default function repoItemRender(item):string {
    return `
        <div class="repo-item well bg-success">
            <div class="repo-item-name">
               <div><strong>Name: </strong> <span class="text-success"> ${item.name} </span></div>
            </div>
            <div class="repo-item-description">
                <div class="dtext">
                    <strong>Description: </strong>
                    <span class="text-warning"> ${item.description}</span>
                </div>
            </div>
            <div class="repo-item-lang">
                <div>
                    <strong class="dtext">Language: </strong>
                    <span class="text-warning dtext"> ${item.language}</span>
                </div>
            </div>
            <div class="repo-item-lang">
                 <div>
                    <strong class="dtext">Url: </strong>
                    <a href="${item.url}" class="dtext"> Git (${item.name})</a>
                 </div>
            </div>
        </div>
    `;
}
