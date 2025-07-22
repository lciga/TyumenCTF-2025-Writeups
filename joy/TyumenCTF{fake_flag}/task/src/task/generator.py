import argparse
import json
import random
import os
import tree


CONF_FILENAME ="config.json"

conf = {
    "flag":{
        "event":"TyumenCTF",
        "flag":"fake_flag"
    },
    "generator":tree.GEN_CONF,
    "workers":12,
    "min_lines": 100,
    "max_lines": 500,
}

trans_dict = {
    'A': 'А', 'a': 'а',
    'B': 'В',
    'C': 'С', 'c': 'с',
    'E': 'Е', 'e': 'е',
    'H': 'Н',
    'K': 'К',
    'M': 'М',
    'O': 'О', 'o': 'о',
    'P': 'Р', 'p': 'р',
    'T': 'Т',
    'X': 'Х', 'x': 'х',
}


def change_leters(s: str) -> str:
    return "".join(map(lambda x: trans_dict[x] if x in trans_dict else x, s))


def make_flag(event: str, flag: str):
    return event + '{' + flag + '}'



def generate_file_suffix(filename):
    return f"{filename}_{os.urandom(2).hex()[:4]}"


def node_handler(node, parent_dir, flag_node, depth=0):
    if depth == 0:
        for child in node.children:
            node_handler(child, parent_dir, flag_node, depth+1)
        return

    filename = generate_file_suffix("fakeflag")
    while os.path.exists(os.path.join(parent_dir, filename)):
        filename = generate_file_suffix("fakeflag")

    full_path = os.path.join(parent_dir, filename)
    
    if node.children:
        os.mkdir(full_path)
        
        for child in node.children:
            node_handler(child, full_path, flag_node, depth+1)
            
    else:
        with open(full_path + '.txt', 'w') as file:
            fake_flag = make_flag(**conf["flag"])
            lines = random.randint(conf["min_lines"], conf["min_lines"])

            if node == flag_node:
                flag_line = random.randint(1, lines)
                file.write(f'{fake_flag}\n' * (flag_line - 1))
                file.write(make_flag(conf["flag"]["event"], change_leters(conf["flag"]['flag'])) + '\n')
                file.write(f'{fake_flag}\n' * (lines - flag_line))

                print(f"Flag: {full_path}.txt")
            else:
                file.write(f'{fake_flag}\n' * lines)


def generate_tree(target: str, conf: dict):
    if os.path.exists(target):
        if not os.path.isdir(target) or os.listdir(target):
            raise Exception("Target is not a dir or not empty")
    else:
        os.makedirs(target, exist_ok=True)
    
    graph = tree.generate_random_tree(**(conf["generator"]))
    flag_node = tree.select_random_leaf(graph)

    node_handler(graph, target, flag_node)
        


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="Fake flag generator",
        description="Generate directory for task 'fake_flag'",
    )

    parser.add_argument("path", type=str,  nargs='?')
    parser.add_argument('-C', '--create-conf', dest="new_config", type=str, nargs='?', const=CONF_FILENAME, help='Create a config file and exit')
    parser.add_argument("-v", "--verbose", action='store_true', help="Print debug info")
    parser.add_argument('-c', '--conf', dest="conf_filename", type=str, help='Load config from file')

    args = parser.parse_args()
    verbose = args.verbose

    if verbose:
        print(f"Argumetns: \n{'\n'.join(map(lambda x: f'{x[0]}={x[1]}', args.__dict__.items()))}\n")

    if args.new_config:
        filename = args.new_config

        if verbose:
            print("Creating conf file:", filename)

        if os.path.exists(filename):
            print("Config already exist. Please, remove it first")
            exit(1)

        try:
            with open(filename, "w") as f:
                json.dump(conf, f, indent=4)
        except Exception as e:
            print("Error while writing file:")
            print(e)
            exit(1)

    elif args.conf_filename:
        if verbose:
            print("Reading conf file:", args.conf_filename)

        try:
            with open(args.conf_filename, 'r') as f:
                conf = json.load(f)
        except FileNotFoundError:
            print(FileNotFoundError("Config don't exist. You can create it with '-C' flag"))
            exit(1)
        except Exception as e:
            print("Error while reading file")

    else:
        if not args.path:
            print("Directory not specified")
            exit(1)

        if verbose:
            print("Generating graph")

        generate_tree(args.path, conf)

        if verbose:
            print("Done")
