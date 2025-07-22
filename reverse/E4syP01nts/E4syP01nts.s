# E4syP01nts BY
#▄▄▄  ▪  ▐▄• ▄ ▄• ▄▌ ▐ ▄  ▐ ▄ ▪    ▪▪▪▪▪  ▄▄▌   ▄▄· 
#▀▄ █·██  █▌█▌▪█▪██▌•█▌▐█•█▌▐███   ▪▪▪▪   ██•  ▐█ ▌▪
#▐▀▀▄ ▐█· ·██· █▌▐█▌▐█▐▐▌▐█▐▐▌▐█·  ▪▪▪▪   ██▪  ██ ▄
#▐█•█▌▐█▌▪▐█·█▌▐█▄█▌██▐█▌██▐█▌▐█▌  ▪▪▪▪   ▐█▌▐▌▐███▌
#.▀  ▀▀▀▀•▀▀ ▀▀ ▀▀▀ ▀▀ █▪▀▀ █▪▀▀▀  ▪▪▪▪   .▀▀▀ ·▀▀▀ 

.section .text
.globl _start

_start:
    mov $1, %rax
    mov $1, %rdi
    lea msg(%rip), %rsi
    mov $msglen, %rdx
    syscall

    mov $60, %rax
    xor %rdi, %rdi
    syscall

decrfl:
    lea encfl(%rip), %rsi
    mov $flaglen, %rcx
    xor %rdx, %rdx

.decrlp:
    movb (%rsi,%rdx), %al
    sub $26, %al

    mov %edx, %r8d
    and $3, %r8d
    lea key2(%rip), %r9
    movb (%r9,%r8), %r10b
    xor %r10b, %al

    mov %edx, %r8d
    and $3, %r8d
    lea key1(%rip), %r9
    movb (%r9,%r8), %r10b
    xor %r10b, %al

    mov %al, (%rsi,%rdx)
    inc %rdx
    loop .decrlp
    ret

.section .rodata
msg:
    .ascii "who wants some E4syP01nts?\n\0"
msglen = . - msg

encfl:
    .byte 0x61, 0x37, 0x40, 0x93, 0x90, 0x24, 0x2a, 0x5a, 0x6f, 0x39, 0x4f, 0x3e, 0x7b, 0x55, 0x41, 0x80, 0x80, 0x71, 0x26, 0x8a, 0x94, 0x31, 0x81, 0x81, 0x98, 0x55, 0x59, 0x3e, 0x7f, 0x71, 0x3b, 0x81, 0x88
flaglen = . - encfl

key1:
    .byte 0xAD, 0xDE, 0xAD, 0xDE
key2:
    .byte 0xBE, 0xBA, 0xFE, 0xCA



