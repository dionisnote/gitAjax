export default function renderGistLink( gist )
{
    return ` <span class="text-success">Gist Created</span> 
            <a class="gist-link" href="${gist.url}" target="blank"> ${gist.description} </a>`;
}