from models.card import Card
import framework.database as database
from modules.sequencer.formulas import calculate_correct
from random import shuffle, random
from math import floor
from functools import reduce
from models.response import Response


p_assessment_map = {
    0: 0.7,
    1: 0.7,
    2: 0.7,
    3: 0.7,
    4: 0.7,
    5: 0.7,
    6: 0.8,
    7: 0.9,
    8: 0.95,
    9: 1,
    10: 1,
}


def partition(l, p):
    return reduce(lambda x, y: x[not p(y)].append(y) or x, l, ([], []))


def choose_card(user, unit):
    """
    TODO@ Given a user and a unit, choose an appropriate card.
    Return a card instance.
    """

    unit_id = unit['entity_id']
    query = (Card.start_accepted_query()
                 .filter({'unit_id': unit_id})
                 .sample(10))  # TODO index
    # TODO does this belong as a model method?
    # TODO is the sample value decent?

    cards = [Card(d) for d in query.run(database.db_conn)]
    shuffle(cards)
    assessment, nonassessment = partition(cards, lambda c: c.has_assessment())

    previous_response = Response.get_latest(user_id=user['id'],
                                            unit_id=unit_id)
    learned = previous_response['learned']

    choose_assessment = random() < p_assessment_map[floor(learned * 10)]

    if choose_assessment:
        if not len(assessment):
            return nonassessment[0]
        for card in assessment:
            params = card.fetch_parameters()
            guess = params.get_distribution('guess').get_value()
            slip = params.get_distribution('slip').get_value()
            correct = calculate_correct(guess, slip, learned)
            if 0.25 < correct < 0.75:
                return card
        return assessment[0]

    if not len(nonassessment):
        return assessment[0]
    return nonassessment[0]