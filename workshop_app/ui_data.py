from django.forms import BoundField


def _normalize_choice(value, label):
    return {
        "value": "" if value is None else str(value),
        "label": str(label),
    }


def serialize_form(form, field_names=None):
    fields = []
    iterable = [form[name] for name in field_names] if field_names else form.visible_fields()

    for bound_field in iterable:
        bound_field: BoundField
        field = bound_field.field
        widget = field.widget
        widget_type = getattr(widget, "input_type", None) or widget.__class__.__name__.lower()
        widget_type = widget.attrs.get("type", widget_type)
        if widget.__class__.__name__ == "Textarea":
            widget_type = "textarea"
        elif widget.__class__.__name__ == "Select":
            widget_type = "select"
        elif widget.__class__.__name__ == "CheckboxInput":
            widget_type = "checkbox"

        field_data = {
            "name": bound_field.name,
            "label": str(bound_field.label or ""),
            "type": widget_type,
            "required": field.required,
            "value": "" if bound_field.value() is None else str(bound_field.value()),
            "help_text": str(field.help_text or ""),
            "errors": [str(error) for error in bound_field.errors],
            "placeholder": widget.attrs.get("placeholder", ""),
        }

        if widget_type == "checkbox":
            field_data["checked"] = bool(bound_field.value())

        if hasattr(field, "choices"):
            field_data["options"] = []
            for option_value, option_label in field.choices:
                if isinstance(option_label, (list, tuple)):
                    field_data["options"].append({
                        "label": str(option_value),
                        "options": [
                            _normalize_choice(group_value, group_label)
                            for group_value, group_label in option_label
                        ],
                    })
                else:
                    field_data["options"].append(_normalize_choice(option_value, option_label))

        fields.append(field_data)

    return {
        "fields": fields,
        "non_field_errors": [str(error) for error in form.non_field_errors()],
    }


def serialize_pagination(page_obj):
    return {
        "number": page_obj.number,
        "num_pages": page_obj.paginator.num_pages,
        "count": page_obj.paginator.count,
        "has_previous": page_obj.has_previous(),
        "has_next": page_obj.has_next(),
        "previous_page_number": page_obj.previous_page_number() if page_obj.has_previous() else None,
        "next_page_number": page_obj.next_page_number() if page_obj.has_next() else None,
        "start_index": page_obj.start_index() if page_obj.paginator.count else 0,
    }
