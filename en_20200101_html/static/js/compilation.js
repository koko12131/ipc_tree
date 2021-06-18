var col = {
    icons:0,
    title:1,
    symbol:2,
    l1:3,
    l2:4
};

function loadStaticFile() {
    $("#compilationtree").fancytree({
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

            if (node.data.kind != "u" && !node.data.amendment) {
                $tdList.remove();
            } else {
                $tdList.eq(col.icons).html(node.data.amendment);

                if (node.data.kind == "u")
                    $tdList.eq(col.symbol).html("<h1>"+node.data.symbol+"</h1>");
                else
                    $tdList.eq(col.symbol).html(node.data.symbol);

                $tdList.eq(col.l1).html(node.data.text)
                .end().find('a[rel="symbol"]').click(function(e){
                    e.preventDefault();
                    //reachSchemeEntry($(this).attr("href").substr(1));
                });

                // It is not possible to add the class to node.tr
                // because fancytree.table will remove it later on
                if ("stcumgni".indexOf(node.data.kind.substr(0,1)) >= 0) {
                    $tdList.addClass(node.data.kind);
                } else {
                    // Subgroup
                    $tdList.addClass("sg");
                }

                if (node.data.amendment) $tdList.addClass(node.data.amendment);
            }
        }
    });
}

$(function(){loadStaticFile();});