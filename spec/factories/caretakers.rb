# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :caretaker do
    first_name "MyString"
    last_name "MyString"
    email "MyString"
    age ""
    nationality "MyString"
    comment "MyText"
    citizen false
    car false
    driver_license false
    english ""
  end
end
