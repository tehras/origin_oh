# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :client do
    first_name "MyString"
    last_name "MyString"
    email "MyString"
    home_number "MyString"
    mobile_phone "MyString"
    fax_number "MyString"
    street "MyString"
    state "MyString"
    zip "MyString"
    nationality "MyString"
    languages "MyString"
    english 1.5
    years 1.5
    hha "MyString"
    driver_license false
    car false
    notes "MyString"
  end
end
