from pathlib import Path
import json
from copy import copy


def traverse(node, parents):
    if "children" in node:
        parents.append(node["name"])
        for child in node["children"]:
            for id, name, hierarchy in traverse(child, copy(parents)):
                yield id, name, hierarchy
    else:
        yield node["index"], node["name"], parents


def create_csv(root):
    nodes = list(traverse(root, parents=[]))

    # first parent is always "ImageNet 2011 Fall Release", remove it
    nodes = [(id, name, parents[1:]) for id, name, parents in nodes]

    # some class ids are listed multiple times, just keep the first one
    def remove_duplicates(items):
        seen = []
        for id, name, parents in items:
            if id not in seen:
                seen.append(id)
                yield id, name, parents
    nodes = list(remove_duplicates(nodes))

    # pad list of parents so that they all have the same length
    max_parents = max([len(parents) for id, name, parents in nodes])
    pad_parents = lambda unpadded: unpadded + [" "] * (max_parents - len(unpadded))
    nodes = [(id, name, pad_parents(parents)) for id, name, parents in nodes]

    # ";" is not used in the names, is a safe separator for the csv
    nodes = [";".join([str(id)] + [name] + parents) for id, name, parents in nodes]
    header = ";".join(["id", "name"] + ["p{}".format(i) for i in range(max_parents)])

    with output_file.open("w") as f:
        f.write(header + "\n")
        f.write("\n".join(nodes))


input_file = Path("mobilenet.json")
output_file = Path("imagenet_class_hierarchy.csv")

classes = json.loads(input_file.read_text())
create_csv(classes)
