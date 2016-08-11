import {Reposlist} from "./reposlist.ts";
import {GistCreator} from "./gistCreator.ts";

///////
var RList = new Reposlist();

RList.inputWatch('repo-search');
/////
var GistObj = new GistCreator();
var newGistBtn = document.getElementById('new-gist-btn');

newGistBtn.addEventListener('click', function(){
    var gistDescription:any = document.getElementById('gist-description');
    var gistFilename:any = document.getElementById('gist-filename');
    var gistText:any = document.getElementById('gist-text');

    var gist = {
        filename:  gistFilename.value,
        description: gistDescription.value,
        text: gistText.value
    } 

    GistObj.createGist( gist );
});