var col = {
    icons:0,
    title:1,
    symbol:2,
    l1:3,
    l2:4
};

function l1RenderCol($tdList, node) {
    $tdList.eq(col.l1).addClass("l1").html(node.data.title1);
    $tdList.eq(col.l2).remove();
    $tdList.eq(col.l1).attr('colspan', 2).show();
}

function l2RenderCol($tdList, node) {
    $tdList.eq(col.l2).addClass("l2").html(node.data.title2);
    $tdList.eq(col.l1).remove();
    $tdList.eq(col.l2).attr('colspan', 2).show();
}

function l3RenderCol($tdList, node) {
    $tdList.eq(col.l1).addClass("l1").html(node.data.title1);
    $tdList.eq(col.l2).addClass("l2").html(node.data.title2);
    $tdList.slice(col.l1,col.l2+1).attr('colspan', 1).show();
}

function renderStructK($tdList, node) {
    // Structured entries only
    $tdList.eq(col.icons).addClass('icons');

    // Symbol
    if ('scu'.indexOf(node.data.kind.substr(0,1)) >= 0) {
        $('<a class="symbol" name="'+node.data.symbolcode+'" href="'+node.data.symbolcode+'.htm#'+node.data.symbolcode+'">'+node.data.symbol+'</a>'
        ).appendTo($tdList.eq(col.symbol));
    } else {
        $('<a class="symbol target" name="'+node.data.symbolcode+'">'+node.data.symbol+'</a>'
        ).appendTo($tdList.eq(col.symbol));
    }
}

function renderStructI($tdList, node) {
    renderStructK($tdList, node);
    // Indexing Symbol
    $tdList.eq(col.symbol).addClass('idx');
}

function renderUnstructK($tdList, node) {
    // Untructured entries only
    $tdList.find(">*").show();
}

function goToSymbol(symbolcode) {
    var page = symbolcode.substr(0,4)+".htm#"+symbolcode;
    if (window.parent.frames.length != 0) {
        window.parent.frames['main'].location.href = page;
    } else {
        window.location.href = page;
    }
}

function showTerm(id, term) {}

$('body').popover({selector: 'a[rel="versions"]', trigger:'hover', placement:'top', html: true});

function loadStaticFile() {
    $("#schemetree").fancytree({
        source: jsonData,
        selectMode: 1,
        scrollParent: $(window),
        scrollOfs: {top:window.innerHeight/2, bottom:window.innerHeight/2},
        activeVisible: true, // Make sure, active nodes are visible (expanded).
        aria: true, // Enable WAI-ARIA support.
        autoActivate: true, // Automatically activate a node when it is focused (using keys).
        icon: false,
        debugLevel: 2, // 0:quiet, 1:normal, 2:debug
        extensions: ["glyph", "table", "gridnav"],
        gridnav: {
            autofocusInput: false,
            handleCursorKeys: true
        },
        table: {
            indentation: 0,
            nodeColumnIdx: 1
        },
        renderColumns: function(event, data) {
            var node = data.node, $tdList = $(node.tr).find(">td");

            // It is not possible to add the class to node.tr
            // because fancytree.table will remove it later on
            $tdList.addClass(node.data.kindclass);

            // Language columns
            window[langIDs[lang] + "RenderCol"]($tdList, node);

            window["render" + node.data.structured + node.data.entrytype]($tdList, node);
        }
    });
    if (window.parent.frames.length != 0) {
        var target = window.parent.frames['main'].location.hash;
        if (target.length > 1)
            window.parent.frames['main'].document.getElementsByName(target.substr(1))[0].scrollIntoView();
    } else {
        var target = window.location.hash;
        if (target.length > 1)
            window.document.getElementsByName(target.substr(1))[0].scrollIntoView();
    }
}

$(function(){loadStaticFile();});

// To support IPCPUB.scheme.go_to_symbol(symbolcode) function that replaces
// goToSymbol one in IPCPUB 7.7:

(function( scheme, $, undefined ) {
    scheme.go_to_symbol = function(symbolcode) {
        goToSymbol(symbolcode);
    };
}( window.scheme = window.scheme || {}, jQuery ));

(function( IPCPUB, $, undefined ) {
    IPCPUB.scheme = scheme;
}( window.IPCPUB = window.IPCPUB || {}, jQuery ));
