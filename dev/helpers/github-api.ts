import {AjaxObj} from "../interfaces/ajaxobj.ts";
import {Request} from "./request.ts";

class githubApi
{
    protected ajax:AjaxObj;
    public callback;

    public constructor()
    {
        let AObj = new Request();
        this.setAjaxObj( AObj );
        
    }
    public getRepos(filter:string)
    {
        let url = 'https://api.github.com/search/repositories';
        let options = {
            q: filter,
            in: 'name',
            sort: 'stars',
            order: 'desc',
            page: '1',
            per_page: '3'
        }

        this.ajax.get( url, options, this.callback );
    }

    public newGist( gistOptions )
    {
        var url = 'https://api.github.com/gists';

        this.ajax.post( url, gistOptions, this.callback );
    }

    public setAjaxObj( obj:AjaxObj )
    {
        this.ajax = obj;
    }
    public setCallback( callback )
    {
        this.callback = callback;
    }

    public stop()
    {
        this.ajax.abortRequest();   
    }



}

export {githubApi};