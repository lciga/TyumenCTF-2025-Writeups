; NICEONE CRACKME BY											 
;▄▄▄  ▪  ▐▄• ▄ ▄• ▄▌ ▐ ▄  ▐ ▄ ▪    ▪▪▪▪▪  ▄▄▌   ▄▄· 
;▀▄ █·██  █▌█▌▪█▪██▌•█▌▐█•█▌▐███   ▪▪▪▪   ██•  ▐█ ▌▪
;▐▀▀▄ ▐█· ·██· █▌▐█▌▐█▐▐▌▐█▐▐▌▐█·  ▪▪▪▪   ██▪  ██ ▄
;▐█•█▌▐█▌▪▐█·█▌▐█▄█▌██▐█▌██▐█▌▐█▌  ▪▪▪▪   ▐█▌▐▌▐███▌
;.▀  ▀▀▀▀•▀▀ ▀▀ ▀▀▀ ▀▀ █▪▀▀ █▪▀▀▀  ▪▪▪▪   .▀▀▀ ·▀▀▀ 

includelib kernel32.lib
includelib user32.lib

ExitProcess proto
GetStdHandle proto
WriteConsoleA proto
ReadConsoleA proto
GetProcessHeap proto
HeapAlloc proto
HeapFree proto

.data
flagmsg db "Let's try something... Password: ",0
flagmsg_len equ $ - flagmsg
msg_generating db "NiceOne! Flag generated!",0
msg_generating_len equ $ - msg_generating
failmsg db "Wrong password",0
failmsg_len equ $ - failmsg
obfpassword db 0EEh, 0E3h, 0E7h, 0F6h, 8Bh
obfflag db 03Ch, 01Ch, 014h, 01Dh, 068h, 06h, 026h, 035h, 036h, 076h, 06h, 054h, 02h, 043h, 052h, 0Ch, 056h, 03h, 05h, 06Ah, 0Fh, 054h, 0Fh, 017h, 052h, 01Bh, 0Eh, 08h, 01Ch, 061h, 012h, 018h
correct dd 0 ; input check

.code

main proc
    sub rsp, 40h
    
    mov rcx, -11
    call GetStdHandle
    mov rcx, rax
    lea rdx, flagmsg
    mov r8, flagmsg_len ; msg length
    xor r9, r9
    call WriteConsoleA
    
    mov rcx, -10
    call GetStdHandle
    mov rcx, rax
    lea rdx, [rsp + 10h] ; buffer
    mov r8d, 5
    lea r9, [rsp + 8h] ; bytes 2 read
    call ReadConsoleA
	
	lea rdi, [rsp + 20h]
	lea rsi, obfpassword
	mov ecx, 5
	mov dl, 86h
	
gen_password_loop:
	mov al, [rsi]
	xor al, dl
	mov [rdi], al
	inc rsi
	inc rdi
	dec ecx
	jnz gen_password_loop
	
    lea rsi, [rsp + 10h] ; cmp pass
    lea rdi, [rsp + 20h]
	mov rcx, 5
	
	repe cmpsb
    jne fail
    
    mov dword ptr correct, 1 
    jmp common_exit
    
fail:
    mov rcx, -11
    call GetStdHandle
    mov rcx, rax
    lea rdx, failmsg
    mov r8, failmsg_len
    xor r9, r9
    call WriteConsoleA
    
common_exit:
    call exit
main endp
     
exit proc
    cmp dword ptr correct, 1
    jne exit_proc_cleanup
	lea rdx, [rsp + 10h] ; password to gen_flag	
    call gen_flag ; FLAG IN HEAP
    
exit_proc_cleanup:
    add rsp, 40h ; restore stack
    xor rcx, rcx
    call ExitProcess
exit endp

gen_flag proc
    call GetProcessHeap ; handle 2 heap
    test rax, rax
    jz gen_fail
    mov rcx, rax
    xor edx, edx ; default flags
    mov r8d, 33 ; buffer size
    call HeapAlloc
    test rax, rax
    jz gen_fail
    mov rbx, rax
	
    mov rsi, offset obfflag
    mov rdi, rbx
    mov ecx, 32
	
copy_loop:
    mov al, [rsi]
    mov [rdi], al
    inc rsi
    inc rdi
    dec ecx
    jnz copy_loop
    
    mov byte ptr [rbx + 32], 0
    
    lea rsi, [rsp + 20h]
    mov rdi, rbx
    mov ecx, 32
    xor edx, edx
    
deobf_loop:
    mov al, [rdi]
    mov bl, [rsi + rdx]
    xor al, bl
    mov [rdi], al
    inc rdi
    inc edx
    cmp edx, 5
    jl no_reset
    xor edx, edx
	
no_reset:
    dec ecx
    jnz deobf_loop
    
    mov rcx, -11
    call GetStdHandle
    mov rcx, rax
    lea rdx, msg_generating
    mov r8, msg_generating_len
    xor r9, r9
    call WriteConsoleA
	
gen_fail:
    add rsp, 40h ; restore stack
    xor rcx, rcx
    call ExitProcess
gen_flag endp

end