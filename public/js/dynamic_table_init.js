function fnFormatDetails ( oTable, nTr )
{
    var aData = oTable.fnGetData( nTr );
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    sOut += '<tr><td>用户昵称：</td><td>'+aData[2]+'</td></tr>';
    sOut += '<tr><td>注册时间:</td><td>'+ aData[4] +'</td></tr>';
    sOut += '<tr><td>个性签名:</td><td>'+ aData[5] +'</td></tr>';
    sOut += '</table>';

    return sOut;
}

$(document).ready(function() {

    $('#dynamic-table').dataTable( {
        "aaSorting": [[ 4, "desc" ]]
    } );

    /*
     * Insert a 'details' column to the table
     */
    var nCloneTh = document.createElement( 'th' );
    var nCloneTd = document.createElement( 'td' );
    nCloneTd.innerHTML = '<img src="images/details_open.png">';
    nCloneTd.className = "center";

    $('#hidden-table-info thead tr').each( function () {
        this.insertBefore( nCloneTh, this.childNodes[0] );
    } );

    $('#hidden-table-info tbody tr').each( function () {
        this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    } );

    /*
     * Initialse DataTables, with no sorting on the 'details' column
     */
    var oTable = $('#hidden-table-info').dataTable( {
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] },
            { "bVisible": false, "aTargets": [ 4 ] },
            { "bVisible": false, "aTargets": [ 5 ] }
        ],
        "aaSorting": [[1, 'asc']]
    });

    /* Add event listener for opening and closing details
     * Note that the indicator for showing which row is open is not controlled by DataTables,
     * rather it is done here
     */
    $(document).on('click','#hidden-table-info tbody td img',function () {
        var nTr = $(this).parents('tr')[0];
        if ( oTable.fnIsOpen(nTr) )
        {
            /* This row is already open - close it */
            this.src = "images/details_open.png";
            oTable.fnClose( nTr );
        }
        else
        {
            /* Open this row */
            this.src = "images/details_close.png";
            oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
        }
    });

    // 用户禁言
       $('#hidden-table-info').on('change', '.optionsRadios', function () {
        // 获取userid
        var userId = $(this).data('userid');
        var isUp = $(this).is(':checked');
        alert(isUp);

        // true 上有权限  false 无权限
        $.ajax({
            url: 'usermanage/setremark',
            type: 'POST',
            data: {userId: userId, setRight: isUp},
            dataType: 'json'
        }).done(function (data) {
            alert(data.msg);
            
        }).fail(function () {
            alert('ajax失败');
        });

   });

} );