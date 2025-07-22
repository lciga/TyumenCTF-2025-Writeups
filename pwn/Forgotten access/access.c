#include <stdio.h>
#include <string.h>

void win() {
    printf("TyumenCTF{**************}\n");
}

int main() {
    setvbuf(stdin, 0, 2, 0);
    setvbuf(stdout, 0, 2, 0);
    setvbuf(stderr, 0, 2, 0);
    char buffer[16];
    int access_level = 0;
    printf("Введите пароль: ");
    gets(buffer);
    if (access_level == 1337) {
        win();
    } else {
        printf("Неверный пароль!\n");
    }
    return 0;
}
