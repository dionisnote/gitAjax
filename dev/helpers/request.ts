import {AjaxObj} from "../interfaces/ajaxobj.ts";

class Request implements AjaxObj
{
    public xhttp;
    public response:any;
    public getReqCache;
    public cacheClearer;
    public cacheClearTime:number;
    
    public constructor() 
    {
        this.clearCache();
        this.cacheClearTime = 120000;
        // get XMLHttpRequest for IE or normal browsers 
        let xhttp;
        try {
            xhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
            xhttp = false;
            }
        }
        if (!xhttp && typeof XMLHttpRequest!='undefined') {
            xhttp = new XMLHttpRequest();
        }
        this.xhttp = xhttp;
        this.cacheClearer = window.setInterval(this.clearCache, this.cacheClearTime );
    }
    
    /**
     * GET-Method request
     */
    public get(addr, options:Object, callback) 
    {
        var self = this;
        var reqUrl = this.addOptions(addr, options);
        var timeout = setTimeout( function(){ self.abortRequest() }, 10000 );
        
        if( self.getReqCache[ reqUrl ] !== undefined ) {
            let cacheResponce = self.getReqCache[ reqUrl ];
            callback(cacheResponce);
        } else {
            // open connection  
            this.xhttp.open('GET', reqUrl, true);
            // this.xhttp.onreadystatechange = this.checkAnswer();
            this.xhttp.onreadystatechange = function(){
                
                // if request was done
                if (this.readyState != 4) return;

                // cancel abort timeout
                clearTimeout(timeout); // clear timeout if was readyState 4

                // if request answer is ok
                if( this.status == 200 ) {
                    self.getReqCache[ reqUrl ] = this.response;
                    callback(this.response);
                    // console.log(this);
                } else { // if answer is not Ok
                    console.warn( 'server ansveres with status: ' + this.status );
                }
            };
            
            this.xhttp.send();
        }
    }
    
    /**
     *  POST-Method request
     */
    public post(addr, options:Object, callback) 
    {
        var self = this;
        var reqUrl = addr;
        var timeout = setTimeout( function(){ self.abortRequest() }, 10000 );
        // var urlOptions = this.optionsToStringUrl( options );
        var urlOptions = JSON.stringify( options );
        console.log( urlOptions );
        
        // open connection  
        this.xhttp.open('POST', reqUrl, true);
        // this.xhttp.onreadystatechange = this.checkAnswer();
        this.xhttp.onreadystatechange = function(){
            
            // if request was done
            if (this.readyState != 4) return;

            // cancel abort timeout
            clearTimeout(timeout); // очистить таймаут при наступлении readyState 4

            // if request answer is ok
            if( this.status == 200 || this.status == 201) {
                callback(this.response);
                // console.log(this);
            } else { // if answer is not Ok
                console.warn( 'server ansveres with status: ' + this.status );
            }
        };
        
        this.xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        this.xhttp.send( urlOptions );
    
    }

    public abortRequest() 
    {
        this.xhttp.abort();
    }

    public clearCache()
    {
        this.getReqCache = {};
    }
    
    protected addOptions( addr:string, options:Object):string
    {
        var reqUrl = addr;
        // if options set
        if( Object.keys( options).length ) {
            reqUrl += '?';
            reqUrl += this.optionsToStringUrl( options );
        }
        return reqUrl;
    } 
    
    protected optionsToStringUrl(options):string
    {
        var urlOpt = '';
        for( var q in options) {
                urlOpt+= q + '=' + options[q] + '&';
        }
        
        return urlOpt;
    }
    
}

export { Request };