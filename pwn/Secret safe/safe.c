#include <stdio.h>

void vuln() {
    char buffer[64];

    printf("Enter your password: ");
    gets(buffer);

    printf(buffer);
    puts("");

    printf("This'is very strong passwort, try again: ");
    gets(buffer);
}

int main() {
    setvbuf(stdin, 0, 2, 0);
    setvbuf(stdout, 0, 2, 0);
    setvbuf(stderr, 0, 2, 0);
    vuln();
}

void win() {
    printf("TyumenCTF{C@n4rj_Byp@s$}\n");
}
