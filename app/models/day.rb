class Day
  include Mongoid::Document

  field :day
  embeds_many :events
end
