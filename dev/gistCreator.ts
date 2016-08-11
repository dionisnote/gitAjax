import {GistProperties} from "./interfaces/gistProperties.ts";
import {githubApi} from "./helpers/github-api.ts";
import renderGistLink from "./templates/gistlink.ts";

class GistCreator
{
    public api;
    
    public constructor( )
    {
        this.api = new githubApi();
    }

    public stop()
    {
        this.api.stop();
    }

    public createGist( gistProps:GistProperties )
    {
        this.api.setCallback( this.showGist );
        
        var gistOption:any = {
            public : true,
            files: {}
        };

         gistOption.description = gistProps.description;
         gistOption.files[ gistProps.filename ] = {
             content: gistProps.text
         };

         this.api.newGist(gistOption);

    }

    public showGist( data, resultEl ) //as callback does/nt have a this context
    {
        var dataObj = JSON.parse(data);
        var gistProps = {
            url: dataObj.html_url,
            description: dataObj.description
        }

        let gistItemHtml = renderGistLink( gistProps );
        var resEl = document.getElementById('gists-list');
        
        var gistEl = document.createElement('div');
        gistEl.className = 'gist-element well';
        gistEl.innerHTML = gistItemHtml; 
        
        resEl.appendChild(gistEl); 
    }
}

export {GistCreator};