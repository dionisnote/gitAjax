export interface AjaxObj {
    post(address:any, options:any, callback:any );
    get(address:any, options:any, callback:any );
    abortRequest();
}