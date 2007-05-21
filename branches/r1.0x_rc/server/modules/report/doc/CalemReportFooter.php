<div class=CalemReportFooterDiv>
	<table class=CalemReportFooterTable>
		<tr>
		   <td class=CalemReportFooter><?php print $reportFooter ?> </td>
		</tr>
	</table>
</div>
</div> <!-- CalemReportMainDiv -->
</body>
</html>
<!-- script to launch print -->
<script language="JavaScript" type="text/javascript">	
   window.onload = preparePrint;
   
   function preparePrint() {
   	setTimeout('printIt()', 1000);	
   }
   
   function printIt() {	  	
		window.print(); 
   }       
</script>
