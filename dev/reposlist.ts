import {githubApi} from "./helpers/github-api.ts";
import repoListRender from "./templates/repoList.ts";

class Reposlist
{
    protected api;
    protected filter:string;
    protected lastSearch:string;

    public constructor(){
        this.api = new githubApi();
    }

    public stop(){
        this.api.stop();
    }

    public getList()
    {
        this.api.setCallback(this.renderList ); //beware: renderList() does'nt have this context
        this.api.getRepos( this.filter );
    }

    public renderList( data ) {
        
        var dataObj = JSON.parse(data); 

        var tpl = repoListRender(dataObj.items);

        var resEl = document.getElementById('result');
        resEl.innerHTML = tpl;
    }

    public inputWatch(idElement)
    {
        var inp = document.getElementById( idElement );
        var that = this;
        inp.addEventListener('keyup', function(e){
            if( this.value.length > 2 && that.lastSearch !== this.value) {
                that.filter = this.value;
                that.lastSearch = this.value;
                that.stop();
                that.getList();
            }
        });
    }

}

export {Reposlist}