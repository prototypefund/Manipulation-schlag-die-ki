from pathlib import Path
import json
from collections import defaultdict


def read_csv(file):
    content = Path(file).read_text().split("\n")
    content = [line.split(";") for line in content]
    content = [line for line in content if line[0]]
    column_names, content = content[0], content[1:]
    column_names = dict(enumerate(column_names))
    content = [{column_names[i]: value for i, value in enumerate(line)} for line in content]
    return content


def extract_categories(content):
    # only keep lines that have both a category and a grouped label
    content = [line for line in content if len(line["category"].strip()) > 0]
    no_label = [line for line in content if len(line["grouped label"].strip()) == 0]
    assert len(no_label) == 0, no_label

    grouped_by_category = defaultdict(lambda: defaultdict(list))
    for line in content:
        grouped_by_category[line["category"]][line["grouped label"]].append(line["id"])

    return grouped_by_category


def extract_classes(content):
    return {line["id"]: line["name"] for line in content}


def write_js(data, file):
    with open(Path(file), "w") as f:
        for variable in data:
            json_data = json.dumps(data[variable], indent=4)
            f.write("const {} = {};\n\n".format(variable, json_data))


hierarchy = read_csv("imagenet_class_hierarchy.csv")

categories = extract_categories(hierarchy)
classes = extract_classes(hierarchy)
write_js({"IMAGENET_CATEGORIES": categories, "IMAGENET_CLASSES": classes}, "imagenet_classes.js")
