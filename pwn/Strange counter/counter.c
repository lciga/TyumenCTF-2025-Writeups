#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void get_flag() {
    printf("TyumenCTF{0v&rf!oW_7h3_l1m!T}\n");
    exit(0);
}

int main() {
    setvbuf(stdin, 0, 2, 0);
    setvbuf(stdout, 0, 2, 0);
    setvbuf(stderr, 0, 2, 0);

    unsigned char count = 0;
    char input[16];
    char secret[16] = "secret_key";

    printf("Welcome to the flag counter!\n");
    printf("You have 100 tries to guess the secret.\n");

    while (1) {
        printf("\nEnter guess (max 15 chars): ");
        fgets(input, 16, stdin);
        input[strcspn(input, "\n")] = 0;

        count++;
        if (count > 100 && count < 0) {
            printf("Too many tries! Goodbye!\n");
            return 1;
        }

        if (strcmp(input, secret) == 0) {
            printf("Correct guess! Here's your reward...\n");
            get_flag();
        } else {
            printf("Wrong guess. Tries left: %d\n", 100 - count);
        }

        if (count == 0) {
            printf("How did you do that?!\n");
            get_flag();
        }
    }
}
