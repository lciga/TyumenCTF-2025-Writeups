#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void printflag() {
    printf("TyumenCTF{4lw4y5_ch3ck_f0r_b0f}\n");
}

void welcome() {
    puts("Welcome to the Lab of Mistakes!");
    puts("This is a safe space for buggy code and silly experiments...");
}

void labprog() {
    char name[4096];
    int flag = 2112;
    printf("Enter your name: ");
    gets(name);
    printf("Hello, %s! Thanks for joining my tiny lab!\n", name);
    if (flag == 2112) {
    	exit(0);
    } else {
    	printflag();
    };
}

int main() {
    setvbuf(stdin, 0, 2, 0);
    setvbuf(stdout, 0, 2, 0);
    setvbuf(stderr, 0, 2, 0);
    welcome();
    labprog();
}
