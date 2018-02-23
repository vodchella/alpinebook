from pkg.utils.verbalexpressions import VerEx

REGEX_HASH_ID = '^[A-z0-9]+$'

DATE = (VerEx().
        add('(').
        find(0).range(1, 9).OR().range(1, 2).range(0, 9).OR().find(3).range(0, 1).
        add(')').
        find('.').
        add('(').
        find(0).range(1, 9).OR().find(1).range(0, 2).
        add(')').
        find('.').range(0, 9).range(0, 9).range(0, 9).range(0, 9).
        s)

TIME = (VerEx().
        add('(').
        range(0, 1).range(0, 9).OR().find(2).range(0, 3).
        add(')').
        find(':').
        add('(').
        range(0, 5).range(0, 9).
        add(')').
        find(':').
        add('(').
        range(0, 5).range(0, 9).
        add(')').
        s)

REGEX_DATE = (VerEx().
              start_of_line().
              add(DATE).
              end_of_line().
              source()
              )

REGEX_DATETIME = (VerEx().
                  start_of_line().
                  add(DATE).
                  find(' ').
                  add(TIME).
                  end_of_line().
                  source()
                  )
