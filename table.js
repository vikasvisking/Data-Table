        var jsondata;

        function Upload() {
            //Reference the FileUpload element.
            var fileUpload = document.getElementById("fileUpload");

            //Validate whether File is valid Excel file.
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
            if (regex.test(fileUpload.value.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();

                    //For Browsers other than IE.
                    if (reader.readAsBinaryString) {
                        reader.onload = function (e) {
                            ProcessExcel(e.target.result);
                        };
                        reader.readAsBinaryString(fileUpload.files[0]);
                    } else {
                        //For IE Browser.
                        reader.onload = function (e) {
                            var data = "";
                            var bytes = new Uint8Array(e.target.result);
                            for (var i = 0; i < bytes.byteLength; i++) {
                                data += String.fromCharCode(bytes[i]);
                            }
                            ProcessExcel(data);
                        };
                        reader.readAsArrayBuffer(fileUpload.files[0]);
                    }
                } else {
                    alert("This browser does not support HTML5.");
                }
            } else {
                alert("Please upload a valid Excel file.");
            }
        };

        function CreateTable(excelRows,status){
            console.log(excelRows);
             //Create a HTML Table element.
             var table = document.createElement("table");
             table.border = "1";

            //Add the header row.
            var row = table.insertRow(-1);
            var keys = Object.keys(excelRows[0]);

            for (var i = 0;i < keys.length; i++){

                //Add the header cells.
                var headerCell = document.createElement("TH");
                if (lastsearched == keys[i]){
                    if (status == 'acc'){
                        headerCell.innerHTML = keys[i] + " &#8593;";
                    }
                    else{
                        headerCell.innerHTML = keys[i] + " &#8595";
                    }
                }
                else{
                    headerCell.innerHTML = keys[i] + " &#8595";
                }
                
                headerCell.setAttribute( "onClick","sort(this.innerHTML)");
                row.appendChild(headerCell);

            }

            //Add the data rows from Excel file.
            for (var i = 0; i < excelRows.length ; i++) {

                //Add the data row.
                var row = table.insertRow(-1);
                for (var j = 0; j < keys.length; j++){

                    var key = keys[j];
                    //Add the data cells.
                    var cell = row.insertCell(-1);
                    cell.innerHTML = excelRows[i][key];

                };
            };

            var dvExcel = document.getElementById("dvExcel");
            dvExcel.innerHTML = "";
            dvExcel.appendChild(table);
        };

        function ProcessExcel(data) {

            //Read the Excel File data.
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            //Fetch the name of First Sheet.
            var firstSheet = workbook.SheetNames[0];

            //Read all rows from First Sheet into an JSON array.
            var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

            jsondata = excelRows;

            CreateTable(excelRows,false);
        };

        var assending = false;
        var lastsearched;
        var status = "des";
        function sort(key)
        {
            var key = key.slice(0,-2)

            if (assending == false && lastsearched != key){
                assending = true;
                if(status == 'des'){
                    status = 'acc';
                }
                else{
                    status = 'des';
                }
                lastsearched = key;

                var tabledata = jsondata.sort(function(a, b)
                {

                  var x = a[key]; var y = b[key];
                  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
              });
            }
            else{

                var tabledata = jsondata.reverse();
                assending = false;
                if(status == 'des'){
                    status = 'acc';
                }
                else{
                    status = 'des';
                }
            }
            CreateTable(tabledata,status);
        }