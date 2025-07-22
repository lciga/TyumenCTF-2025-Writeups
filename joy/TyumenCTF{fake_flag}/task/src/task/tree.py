import random


GEN_CONF = {
    "min_children":3,
    "max_children":6,
    "min_depth":2,
    "max_depth":6,
    "initial_no_child_prob":0.5,
    "final_no_child_prob":0.9,
    "min_leaves":500
}


class TreeNode:
    def __init__(self):
        self.children = []


def count_leaf_nodes(node: TreeNode) -> int:
    if not node.children:
        return 1
    else:
        leaves_count = 0
        for child in node.children:
            leaves_count += count_leaf_nodes(child)
        return leaves_count


def get_leaves(node:  TreeNode, output: list):
    if not node.children:
        output.append(node)
        return
    else:
        for child in node.children:
            get_leaves(child, output)


def select_random_leaf(node):
    nodes = []
    get_leaves(node, nodes)
    return random.choice(nodes)


def generate_random_tree(min_children, max_children, min_depth, max_depth, current_depth=0,
                        initial_no_child_prob=0.1, final_no_child_prob=0.9, min_leaves=100):

    prob_no_children = initial_no_child_prob + (final_no_child_prob - initial_no_child_prob) * (current_depth / max_depth)
    
    if current_depth >= max_depth or (current_depth > min_depth and random.random() < prob_no_children):
        return TreeNode()
    
    node = TreeNode()
    num_children = random.randint(min_children, max_children)
    
    for _ in range(num_children):
        child_node = generate_random_tree(min_children, max_children, min_depth, max_depth,
                                         current_depth + 1, initial_no_child_prob,
                                         final_no_child_prob, min_leaves)
        if child_node is not None:
            node.children.append(child_node)
    
    # cur_min_leaves = floor(min_leaves / pow(mean((min_depth, max_depth)), current_depth))
    nodes = count_leaf_nodes(node)
    if current_depth == 0 and nodes < min_leaves:
        while nodes < min_leaves:
            child_node = generate_random_tree(min_children, max_children, min_depth, max_depth,
                                        current_depth + 1, initial_no_child_prob,
                                        final_no_child_prob, min_leaves)
            if child_node is not None:
                nodes += count_leaf_nodes(child_node)
                node.children.append(child_node)
    
    return node