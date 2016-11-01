!macro customInstall
  DetailPrint "Register todo2 URI Handler"
  DeleteRegKey HKCR "todo2"
  WriteRegStr HKCR "todo2" "" "URL:todo2"
  WriteRegStr HKCR "todo2" "URL Protocol" ""
  WriteRegStr HKCR "todo2\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "todo2\shell" "" ""
  WriteRegStr HKCR "todo2\shell\Open" "" ""
  WriteRegStr HKCR "todo2\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
