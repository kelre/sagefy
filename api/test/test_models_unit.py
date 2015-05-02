from models.unit import Unit


def test_entity_id(db_conn, units_table):
    """
    Expect a unit to require an entity_id.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
        'body': 'Learn how to do this',
    })
    assert len(errors) == 0
    unit['entity_id'] = 'JFKLD1234'
    unit, errors = unit.save()
    assert len(errors) == 0


def test_previous(db_conn, units_table):
    """
    Expect a version previous_id to be a string or None.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
        'body': 'Learn how to do this',
    })
    assert len(errors) == 0
    unit['previous_id'] = 'AFJkl345'
    unit, errors = unit.save()
    assert len(errors) == 0


def test_language(db_conn, units_table):
    """
    Expect a unit to require a language.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
        'body': 'Learn how to do this',
    })
    assert len(errors) == 0
    assert unit['language'] == 'en'


def test_name(db_conn, units_table):
    """
    Expect a unit to require a name.
    """

    unit, errors = Unit.insert({
        'body': 'Learn how to do this',
    })
    assert len(errors) == 1
    unit['name'] = 'Learn this'
    unit, errors = unit.save()
    assert len(errors) == 0


def test_body(db_conn, units_table):
    """
    Expect a unit to require a body.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
    })
    assert len(errors) == 1
    unit['body'] = 'Learn how to do this'
    unit, errors = unit.save()
    assert len(errors) == 0


def test_accepted(db_conn, units_table):
    """
    Expect a unit accepted to be a boolean.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
        'body': 'Learn how to do this',
    })
    assert len(errors) == 0
    assert unit['accepted'] is False
    unit['accepted'] = True
    unit, errors = unit.save()
    assert len(errors) == 0


def test_tags(db_conn, units_table):
    """
    Expect a unit to allow tags.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
        'body': 'Learn how to do this',
    })
    assert len(errors) == 0
    unit['tags'] = ['A', 'B']
    unit, errors = unit.save()
    assert len(errors) == 0


def test_requires(db_conn, units_table):
    """
    Expect a unit to allow requires ids.
    """

    unit, errors = Unit.insert({
        'name': 'Learn this',
        'body': 'Learn how to do this',
    })
    assert len(errors) == 0
    unit['require_ids'] = ['A']
    unit, errors = unit.save()
    assert len(errors) == 0