# Special Calc

_Калькулятор с секретом_

# Решение
1.     При запуске программы видим простой калькулятор, однако, как сказано в описании, он с секретом. Прогоняем его через DetectItEasy:

![](Pasted%20image%2020250419023738.png)

Из программ, собранных PyInstaller’ом, можно достать .pyc файлы и декомпилировать их. Загружаем наш калькулятор в pyinstxtractor, например, веб-версию: [pyinstxtractor/](https://pyinstxtractor-web.netlify.app/)

2.     Получаем архив. Из всех файлов нас интересует только calc.pyc

![](Pasted%20image%2020250419023746.png)

3.     Для декомпиляции воспользуемся, например, [pylingual](https://pylingual.io/)

Загружаем calc.pyc и анализируем код
```python
	# Decompiled with PyLingual (https://pylingual.io)  
	# Internal filename: calc.py  
	# Bytecode version: 3.13.0rc3 (3571)  
	# Source timestamp: 1970-01-01 00:00:00 UTC (0)  
  
	import tkinter as tk  
	import math  
	from tkinter import PhotoImage  
	import pkgutil  
	from secret import get_secret  
	  
	def get_mnumber():  
	    part1 = 73000    part2 = 8217900    part3 = 43    return part1 * 10000000 + part2 * 10 + part3  
	  
	def mnumber1():    return 123456789012  
	  
	def mnumber2():    return 987654321098  
	  
	def chklen(expr):    return len(expr) == 12  
	  
	def chkdigits(expr):    return expr.isdigit()  
	  
	def valinput(expr):    return chklen(expr) and chkdigits(expr)  
	  
	def seval(expr):    if not expr:        pass  
	    return 'Error'  
	  
	def onclick(symbol):  
	    content = entry.get()    if content == 'Error' or content.startswith('TyumenCTF{'):  
	        entry.delete(0, tk.END)    if symbol == 'C':  
	        entry.delete(0, tk.END)    return None  
	  
	def valkey(event):  
	    allowed_chars = '0123456789.+-*/^√('    if event.keysym in ['BackSpace', 'Control_L', 'Control_R']:        pass  
	    return None  
	BG_COLOR = '#1e1e1e'  
	BTN_COLOR = '#2e2e2e'  
	BTN_HOVER = '#444'  
	TXT_COLOR = '#00ffcc'  
	ENTRY_BG = '#121212'  
	root = tk.Tk()  
	root.title('Special Baby Calc')  
	icon_data = pkgutil.get_data('icons', 'icon.png')  
	icon = PhotoImage(data=icon_data)  
	root.iconphoto(False, icon)  
	root.geometry('410x500')  
	root.configure(bg=BG_COLOR)  
	root.resizable(False, False)  
	entry = tk.Entry(root, width=26, font=('Consolas', 20), bd=0, relief='flat', bg=ENTRY_BG, fg=TXT_COLOR, insertbackground=TXT_COLOR, justify='right')  
	entry.grid(row=0, column=0, columnspan=4, padx=10, pady=15, ipady=10)  
	entry.bind('<Control-c>', lambda e: entry.event_generate('<<Copy>>'))  
	entry.bind('<Control-v>', lambda e: entry.event_generate('<<Paste>>'))  
	buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C', '^', '√']  
	row, col = (1, 0)  
	for btn in buttons:    def action(b=btn):        return lambda: onclick(b)  
	    b = tk.Button(root, text=btn, width=5, height=2, font=('Consolas', 14), bg=BTN_COLOR, fg='white', activebackground=BTN_HOVER, activeforeground=TXT_COLOR, relief='flat', command=action(btn))  
	    b.grid(row=row, column=col, padx=5, pady=5, ipadx=5, ipady=5)  
	    col += 1    if col > 3:        pass  
	    else:  
	        col = 0        row += 1  
	root.mainloop()
```
Видим, что в программе отсутствует функция, отвечающая за вывод флага. На самом деле она содержится в PYZ.pyz_extracted\secret.pyc, но обфусцирована PyArmor’ом. В целом, она нам не пригодится – калькулятор выводит флаг, если мы вводим определённое значение, указанное в get_mnumber. Помимо него есть и ложные ключи, mnumber1 и mnumber2.

```python
def get_mnumber():  
    part1 = 73000    part2 = 8217900    part3 = 43    return part1 * 10000000 + part2 * 10 + part3
```

Решаем вручную: 73000 * 10000000 + 8217900 * 10 + 43 = 730000000000 + 82179000 + 43 = 730082179043

4.     Вводим получившееся значение в калькулятор, нажимаем “=” и получаем флаг.

![](Pasted%20image%2020250419023800.png)

![](Pasted%20image%2020250419023810.png)

# Флаг
`TyumenCTF{b4by_c4lc_ju5t_g1v3_m3_fl4g}`