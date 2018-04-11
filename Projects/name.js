window.addEventListener('load', myInit, false);

function myInit()
{
    if (titleElementExists() == true)
        document.getElementsByTagName('title')[0].innerText = constructPageTitleStr();
    else
        addPageTitle();
    /*
        other initialization code here.
    */
}

function titleElementExists()
{
    var titleEl = document.getElementsByTagName('title');
    if (titleEl.length == 0)
        return false;
    return true;
}


function constructPageTitleStr()
{
    var locationStr = window.location.pathname;

    // make sure the below line reflects the actual name of the file
    // sets locationStr = "enhzflep"
    locationStr = locationStr.replace("/index.html", "");

    // get the position of the last / char in the string
    var slashPos = locationStr.lastIndexOf("/");

    // extract the string that remains after it
    locationStr = locationStr.substr(slashPos+1);
    return locationStr;
}

function addPageTitle()
{
    var locationStr = constructPageTitleStr();
    var title = document.createElement('title');
    var titleText = document.createTextNode( 'Page Title = ' + locationStr );
    title.appendChild( titleText );
    document.head.appendChild(title);
}
