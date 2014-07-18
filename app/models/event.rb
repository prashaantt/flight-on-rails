class Event
  include Mongoid::Document

  embedded_in :day
end
